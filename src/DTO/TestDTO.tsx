export interface TestDTO{
    test_name: string
}

// DTO 객체 생성 (필요 시 클래스 형태도 가능)
export class TestDTOClass implements TestDTO {
    constructor(public test_name: string) {}
  }
  