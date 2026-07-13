/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Author Model
 * ---------------------------------------------------------
 */

export interface Author {
  id: number;
  name: string;
  nationality: string | null;
}

export interface CreateAuthorInput {
  name: string;
  nationality?: string | null;
}

export interface UpdateAuthorInput {
  name: string;
  nationality?: string | null;
}