/**
 * @fileoverview Data Transfer Objects (DTO) for Expense operations.
 * Defines the structures for creating and updating expenses.
 */

/**
 * DTO for creating an expense.
 */
export interface CreateExpenseDTO {
    readonly category: string;
    readonly amount: number;
    readonly description?: string;
    readonly date?: string | Date;
}

/**
 * DTO for updating an expense.
 */
export interface UpdateExpenseDTO {
    readonly category?: string;
    readonly amount?: number;
    readonly description?: string;
    readonly date?: string | Date;
}
