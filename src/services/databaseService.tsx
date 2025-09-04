// src/services/databaseService.ts
import SQLite from 'react-native-sqlite-storage';
import { ParseResultDTO } from '../DTO/ParseResultDTO';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native'

SQLite.enablePromise(true); // 프로미스 방식 활성화

type DB = Awaited<ReturnType<typeof SQLite.openDatabase>>;

export const openDatabase = async () => {
    console.log('DB 파일 경로:', RNFS.DocumentDirectoryPath + '/app.db');
    try {
        const db = await SQLite.openDatabase({ name: 'app.db', location: 'default' });
        return db;
    } catch (error) {
        console.error('DB 오픈 실패:', error);
        throw error;
    }
};

export const createTables = async (db: DB) => {
    try {
        await db.executeSql(`
      CREATE TABLE IF NOT EXISTS Tests (
        test_id INTEGER PRIMARY KEY,
        test_name TEXT NOT NULL
      );
    `);

        await db.executeSql(`
      CREATE TABLE IF NOT EXISTS Problems (
        problem_id INTEGER PRIMARY KEY,
        test_id INTEGER,
        type TEXT,
        number INTEGER,
        content TEXT,
        figure TEXT,
        options TEXT,
        FOREIGN KEY (test_id) REFERENCES Tests(test_id)
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

        if (!test || !test.test_name) {
            throw new Error('시험 정보가 없습니다.');
        }
        if (!Array.isArray(problems) || problems.length === 0) {
            throw new Error('문제 내용이 없습니다.');
        }

        const db = await openDatabase();

        // 시험 저장
        const insertTestSql = 'INSERT INTO Tests (test_name) VALUES (?);';
        const testResult = await db.executeSql(insertTestSql, [test.test_name]);
        const insertedTestId = testResult?.[0]?.insertId;
        console.log('[DB] Tests insert result:', testResult?.[0]);

        if (insertedTestId === undefined || insertedTestId === null) {
            throw new Error('시험 저장 중 test_id를 가져오지 못했습니다.');
        }

        // 문제 저장
        const insertProblemSql = `
                INSERT INTO Problems (test_id, type, number, content, figure, options)
                VALUES (?, ?, ?, ?, ?, ?);
            `;

        for (const problem of problems) {
            try {
                const type = problem.type;
                const number = Number(problem.number);
                const content = problem.content;
                const figure = problem.figure ?? null;
                const options = problem.options ?? null;

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