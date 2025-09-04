// src/services/databaseService.ts
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true); // 프로미스 방식 활성화

export const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabase({ name: 'app.db', location: 'default' });
    return db;
  } catch (error) {
    console.error('DB 오픈 실패:', error);
    throw error;
  }
};

export const createTables = async (db: SQLite.SQLiteDatabase) => {
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
