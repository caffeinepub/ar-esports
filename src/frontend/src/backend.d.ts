import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TournamentSlot {
    id: bigint;
    name: string;
    time: string;
    entryFee: bigint;
    prizePool: bigint;
}
export interface UserProfile {
    age: bigint;
    name: string;
    createdAt: bigint;
    email: string;
}
export interface Registration {
    id: string;
    status: RegistrationStatus;
    userId: Principal;
    createdAt: bigint;
    upiOrInsta: string;
    email: string;
    teamMembers: string;
    slotId: bigint;
    gameName: string;
    phone: string;
    ffUID: string;
}
export enum RegistrationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminLogin(password: string): Promise<boolean>;
    approvePayment(registrationId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllRegistrations(): Promise<Array<Registration>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyRegistrations(): Promise<Array<Registration>>;
    getTournamentSlots(): Promise<Array<TournamentSlot>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerForTournament(slotId: bigint, ffUID: string, gameName: string, phone: string, email: string, teamMembers: string, upiOrInsta: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    rejectPayment(registrationId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveUserProfile(name: string, email: string, age: bigint): Promise<void>;
    submitPaymentClaim(registrationId: string): Promise<void>;
}
