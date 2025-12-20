import { describe, it, expect } from "vitest";
import { deepClone, sortBy, orderBy } from "./data-utils";

describe("Data Utils", () => {
  describe("deepClone", () => {
    it("should clone primitive values", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone("hello")).toBe("hello");
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it("should clone simple objects", () => {
      const original = { name: "Alice", age: 30 };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it("should clone nested objects", () => {
      const original = {
        user: {
          name: "Alice",
          address: {
            city: "New York",
            zip: "10001",
          },
        },
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.user).not.toBe(original.user);
      expect(cloned.user.address).not.toBe(original.user.address);
    });

    it("should clone arrays", () => {
      const original = [1, 2, 3, 4, 5];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it("should clone arrays of objects", () => {
      const original = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);
      expect(cloned[1]).not.toBe(original[1]);
    });

    it("should clone objects with arrays", () => {
      const original = {
        name: "Project",
        tags: ["tag1", "tag2", "tag3"],
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.tags).not.toBe(original.tags);
    });

    it("should handle Date objects", () => {
      const original = { createdAt: new Date("2025-01-01") };
      const cloned = deepClone(original);

      expect(cloned.createdAt).toEqual(original.createdAt);
    });
  });

  describe("sortBy", () => {
    interface TestItem {
      id: number;
      name: string;
      age: number;
      city: string;
    }

    const testData: TestItem[] = [
      { id: 1, name: "Charlie", age: 35, city: "Boston" },
      { id: 2, name: "Alice", age: 30, city: "New York" },
      { id: 3, name: "Bob", age: 25, city: "Chicago" },
      { id: 4, name: "David", age: 28, city: "Austin" },
    ];

    it("should sort by single field ascending", () => {
      const sorted = sortBy(testData, ["name"]);

      expect(sorted[0].name).toBe("Alice");
      expect(sorted[1].name).toBe("Bob");
      expect(sorted[2].name).toBe("Charlie");
      expect(sorted[3].name).toBe("David");
    });

    it("should sort by single field ascending only", () => {
      const sorted = sortBy(testData, ["age"]);

      expect(sorted[0].age).toBe(25);
      expect(sorted[1].age).toBe(28);
      expect(sorted[2].age).toBe(30);
      expect(sorted[3].age).toBe(35);
    });

    it("should sort by multiple fields", () => {
      const dataWithDuplicates = [
        { id: 1, name: "Alice", age: 30, city: "Boston" },
        { id: 2, name: "Bob", age: 25, city: "New York" },
        { id: 3, name: "Alice", age: 25, city: "Chicago" },
        { id: 4, name: "Bob", age: 30, city: "Austin" },
      ];

      const sorted = sortBy(dataWithDuplicates, ["name", "age"]);

      expect(sorted[0]).toEqual({ id: 3, name: "Alice", age: 25, city: "Chicago" });
      expect(sorted[1]).toEqual({ id: 1, name: "Alice", age: 30, city: "Boston" });
      expect(sorted[2]).toEqual({ id: 2, name: "Bob", age: 25, city: "New York" });
      expect(sorted[3]).toEqual({ id: 4, name: "Bob", age: 30, city: "Austin" });
    });

    it("should not mutate original array", () => {
      const original = [...testData];
      sortBy(testData, ["name"]);

      expect(testData).toEqual(original);
    });

    it("should handle empty array", () => {
      const sorted = sortBy([], ["name"]);
      expect(sorted).toEqual([]);
    });

    it("should handle single item array", () => {
      const singleItem = [{ id: 1, name: "Alice", age: 30, city: "Boston" }];
      const sorted = sortBy(singleItem, ["name"]);

      expect(sorted).toEqual(singleItem);
    });
  });

  describe("orderBy", () => {
    interface TestItem {
      id: number;
      name: string;
      score: number;
    }

    const testData: TestItem[] = [
      { id: 1, name: "Charlie", score: 85 },
      { id: 2, name: "Alice", score: 92 },
      { id: 3, name: "Bob", score: 78 },
      { id: 4, name: "David", score: 95 },
    ];

    it("should sort by single field ascending", () => {
      const sorted = orderBy(testData, ["score"], ["asc"]);

      expect(sorted[0].score).toBe(78);
      expect(sorted[1].score).toBe(85);
      expect(sorted[2].score).toBe(92);
      expect(sorted[3].score).toBe(95);
    });

    it("should sort by single field descending", () => {
      const sorted = orderBy(testData, ["score"], ["desc"]);

      expect(sorted[0].score).toBe(95);
      expect(sorted[1].score).toBe(92);
      expect(sorted[2].score).toBe(85);
      expect(sorted[3].score).toBe(78);
    });

    it("should sort by multiple fields", () => {
      const dataWithDuplicates = [
        { id: 1, name: "Alice", score: 85 },
        { id: 2, name: "Bob", score: 92 },
        { id: 3, name: "Alice", score: 92 },
        { id: 4, name: "Bob", score: 85 },
      ];

      const sorted = orderBy(dataWithDuplicates, ["score", "name"], ["desc", "asc"]);

      expect(sorted[0]).toEqual({ id: 3, name: "Alice", score: 92 });
      expect(sorted[1]).toEqual({ id: 2, name: "Bob", score: 92 });
      expect(sorted[2]).toEqual({ id: 1, name: "Alice", score: 85 });
      expect(sorted[3]).toEqual({ id: 4, name: "Bob", score: 85 });
    });

    it("should default order to asc when not all orders provided", () => {
      const sorted = orderBy(testData, ["score", "name"], ["desc"]);

      expect(sorted[0].score).toBe(95);
      expect(sorted[3].score).toBe(78);
    });

    it("should not mutate original array", () => {
      const original = [...testData];
      orderBy(testData, ["score"], ["asc"]);

      expect(testData).toEqual(original);
    });

    it("should handle empty array", () => {
      const sorted = orderBy([], ["score"], ["asc"]);
      expect(sorted).toEqual([]);
    });
  });
});
