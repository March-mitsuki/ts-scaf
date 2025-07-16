const template = `
import { describe, it, expect } from "vitest";
import { add } from "@/index";

describe("Test installation", () => {
  it("should add two numbers correctly", () => {
    const result = add(5, 3);
    expect(result).toBe(8);
  });
});
`;

export default tmplate.trim() + "\n";
