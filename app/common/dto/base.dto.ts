/**
 * Interface representing the base schema for documents.
 * 
 * This interface defines the common fields for documents in the database, including an ID and timestamps
 * for tracking when the document was created and last updated.
 * 
 * @interface BaseSchema
 * @property {string} _id - The unique identifier for the document.
 * @property {string} createdAt - The timestamp representing when the document was created.
 * @property {string} updatedAt - The timestamp representing the last time the document was updated.
 */
export interface BaseSchema {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
