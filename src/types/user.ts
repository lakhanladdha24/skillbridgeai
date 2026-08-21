export interface User {
    id: string;
    email: string;
    name: string;
    skills?: { name: string; level: string }[];
    photoURL?: string;
}
