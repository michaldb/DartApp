export interface Channel {
    name: string;
    isPublicChannel: boolean;
    users?: string[];
    key?: string;
    owner?: string;
}
