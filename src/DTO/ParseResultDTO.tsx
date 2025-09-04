import { TestDTO } from "./TestDTO";
import { ProblemDTO } from "./ProblemDTO";

export interface ParseResultDTO {
    test: TestDTO;
    problems: ProblemDTO[];
  }
  