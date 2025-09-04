// src/services/databaseService.ts
import SQLite from 'react-native-sqlite-storage';
import { ParseResultDTO } from '../DTO/ParseResultDTO';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native'

SQLite.enablePromise(true); // 프로미스 방식 활성화

type DB = Awaited<ReturnType<typeof SQLite.openDatabase>>;

export const openDatabase = async () => {
    console.log('DB 파일 경로:', RNFS.DocumentDirectoryPath + '/app_v2.db');
    try {
        const db = await SQLite.openDatabase({ name: 'app_v2.db', location: 'default' });
        return db;
    } catch (error) {
        console.error('DB 오픈 실패:', error);
        throw error;
    }
};

export const createTables = async (db: DB) => {
    try {
        await db.executeSql('PRAGMA foreign_keys = ON;');
        await db.executeSql(`
      CREATE TABLE IF NOT EXISTS Tests (
        test_id INTEGER PRIMARY KEY,
        test_name TEXT NOT NULL,
        total_problems INTEGER NOT NULL DEFAULT 0,
        correct_problems INTEGER NOT NULL DEFAULT 0
      );
    `);

        await db.executeSql(`
      CREATE TABLE IF NOT EXISTS Problems (
        problem_id INTEGER PRIMARY KEY,
        test_id INTEGER NOT NULL,
        type TEXT,
        number INTEGER,
        content TEXT,
        figure TEXT,
        options TEXT,
        correct_answer TEXT,
        selected_answer TEXT,
        FOREIGN KEY (test_id) REFERENCES Tests(test_id) ON DELETE CASCADE
      );
    `);
    } catch (error) {
        console.error('테이블 생성 실패:', error);
        throw error;
    }
};

export const saveParseResult = async (parseResult: ParseResultDTO) => {
    try {
        const test = parseResult.test;
        const problems = parseResult.problems;

        // 자동 채점 결과 계산
        const totalProblems = Array.isArray(problems) ? problems.length : 0;
        const correctProblems = Array.isArray(problems)
            ? problems.reduce((count, p) => {
                const correct = (p.correct_answer ?? '').trim();
                const selected = (p.selected_answer ?? '').trim();
                return count + (correct.length > 0 && selected.length > 0 && correct === selected ? 1 : 0);
            }, 0)
            : 0;
        test.total_problems = totalProblems;
        test.correct_problems = correctProblems;

        if (!test || !test.test_name) {
            throw new Error('시험 정보가 없습니다.');
        }
        if (!Array.isArray(problems) || problems.length === 0) {
            throw new Error('문제 내용이 없습니다.');
        }

        const db = await openDatabase();

        // 시험 저장
        const insertTestSql = 'INSERT INTO Tests (test_name, total_problems, correct_problems) VALUES (?, ?, ?);';
        const testResult = await db.executeSql(insertTestSql, [test.test_name, test.total_problems, test.correct_problems]);
        const insertedTestId = testResult?.[0]?.insertId;
        console.log('[DB] Tests insert result:', testResult?.[0]);

        if (insertedTestId === undefined || insertedTestId === null) {
            throw new Error('시험 저장 중 test_id를 가져오지 못했습니다.');
        }

        // 문제 저장
        const insertProblemSql = `
                INSERT INTO Problems (test_id, type, number, content, figure, options, correct_answer, selected_answer)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;

        for (const problem of problems) {
            try {
                const type = problem.type;
                const number = Number(problem.number);
                const content = problem.content;
                const figure = problem.figure ?? null;
                const options = problem.options ?? null;
                const correct_answer = problem.correct_answer;
                const selected_answer = problem.selected_answer ?? null;

                if (!type || Number.isNaN(number) || !content) {
                    console.warn('[DB] 유효하지 않은 문제 데이터로 인해 건너뜀:', problem);
                    continue;
                }

                const res = await db.executeSql(
                    insertProblemSql,
                    [
                        insertedTestId,
                        type,
                        number,
                        content,
                        figure,
                        options,
                        correct_answer,
                        selected_answer
                    ]
                );
                const rowsAffected = res?.[0]?.rowsAffected;
                console.log(`[DB] Problem inserted. rowsAffected=${rowsAffected}, number=${number}`);
            } catch (err) {
                console.error('[DB] 문제 저장 실패 (개별):', err);
                throw err; // 중단하여 상위에서 처리 (부분 저장 방지)
            }
        }

        Alert.alert('파싱 저장 성공');
        return { test, problems };
    }
    catch (error) {
        console.error('파싱 결과 저장 실패:', error);
        Alert.alert('파싱 결과 저장 실패');
        throw error;
    }
}

// 새로 추가: 저장된 시험 목록 조회
export const getAllTests = async () => { 
    // db 객체 열기 (클라이언트랑 비슷한 느낌. 하지만 다름)
    const db = await openDatabase();
    // sql 쿼리 
    const sql = 'SELECT test_id, test_name, total_problems, correct_problems FROM Tests ORDER BY test_id DESC';
    // db 클라이언트를 통해 쿼리를 날리고 응답을 받음.
    const res = await db.executeSql(sql);
    // 결과 배열의 첫 번째 요소에 rows가 포함되기 때문
    const rows = res?.[0]?.rows;
    // 배열의 각 요소를 problem 형식에 맞춰서 찾도록 타입 정의
    const items = [] as Array<{ test_id: number; test_name: string; total_problems: number; correct_problems: number }>;
    // 각 엔티티를 items에 삽입
    for (let i = 0; i < rows.length; i++) {
        items.push(rows.item(i));
    }
    return items;
};

// 새로 추가: 특정 시험의 문제 목록 조회
export const getProblemsByTestId = async (testId: number) => {
    // db 클라이언트 열기
    const db = await openDatabase();
    // sql 쿼리 작성 (변수는 ?로 정의)
    const sql = `SELECT problem_id, test_id, type, number, content, figure, options, correct_answer, selected_answer FROM Problems WHERE test_id = ? ORDER BY number ASC`;
    // testId를 변수로 받아서 sql 쿼리를 완성, 쿼리 실행
    const res = await db.executeSql(sql, [testId]);
    // 결과 값 받기
    const rows = res?.[0]?.rows;
    // 결과 엔티티 정의 (problem 각 엔티티)
    const items = [] as Array<{
        problem_id: number;
        test_id: number;
        type: string | null;
        number: number | null;
        content: string | null;
        figure: string | null;
        options: string | null;
        correct_answer: string | null;
        selected_answer: string | null;
    }>;
    // items 정리
    for (let i = 0; i < rows.length; i++) {
        items.push(rows.item(i));
    }
    return items;
};