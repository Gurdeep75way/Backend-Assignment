/**
 * Data Transfer Object (DTO) for creating or updating a budget.
 * This interface represents the data structure used for transferring budget data.
 */
export interface BudgetDTO {
    /**
     * The title of the budget (e.g., "Food", "Transport").
     * 
     * @type {string}
     */
    title: string;

    /**
     * The amount allocated for the budget.
     * The amount must be a positive number.
     * 
     * @type {number}
     */
    amount: number;

    /**
     * The category to which this budget is assigned.
     * The category is typically a string representing the category name (e.g., "Food", "Transport").
     * 
     * @type {string}
     */
    category: string;

    /**
     * The ID of the user who owns this budget.
     * This ID is typically a reference to the `User` model.
     * 
     * @type {string}
     */
    userId: string;

    // Optional field: The `id` property can be used to reference the user who owns the budget.
    // id: string; 
}
