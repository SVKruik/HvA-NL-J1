export type UserData = {
    id: number;
    username: string;
    email: string;
    type: keyof typeof UserTypes;
    avatar?: string;
    init: boolean;
};

// Toast System
export enum ToastTypes {
    info = "info",
    success = "success",
    warning = "warning",
    danger = "danger",
}

export interface IBurrow {
    id: number;
    name: string;
    avatar: string;
    is_nsfw_allowed: boolean;
}
export type newBurrow = {
    hopper_id: number;
    name: string;
    description: string;
    avatar: string;
    banner: string;
    isNsfwAllowed: boolean;
    tags: Array<Tag>;
    labels: Array<newLabel>;
};
export type BurrowApi = {
    burrow_id: number;
    hopper_id: number;
    name: string;
    description: string;
    avatar: string;
    banner: string;
    isNsfwAllowed: boolean;
    tags: Array<Tag>;
    labels: Array<newLabel>;
    rules?: string[];
};

export type PostResponse = {
    success: boolean;
    postId: number;
};

// Log System
export enum LogTypes {
    info = "INFO",
    warning = "WARNING",
    alert = "ALERT",
    error = "ERROR",
    fatal = "FATAL",
    none = "NONE",
}

// Keepers
export type KeeperTypes = {
    id: number;
    name: string;
    avatar: string;
    email: string;
    owner: boolean;
    keeper: boolean;
};
// Paginated Keeper Burrows
export type PaginatedKeeperBurrowTypes = {
    data: KeeperTypes[];
    pagination: {
        page: number;
        total_pages: number;
    };
};

// Event Log
export type EventLogTypes = {
    object_type: string;
    object_id: number;
    description: string;
    endpoint: string;
    date_creation: string;
};

// Paginated Event Log
export type PaginatedEventLogTypes = {
    data: EventLogTypes[];
    pagination: {
        page: number;
        total_pages: number;
    };
};

// User Types/Roles
export enum UserTypes {
    Stray = "Stray",
    Hopper = "Hopper",
    Admin = "Admin",
}

// User Status Types
export enum UserStatusTypes {
    active = "active",
    timeout = "timeout",
    banned = "banned",
}

// Toast Message Item
export type ToastItem = {
    id: string;
    type: ToastTypes;
    duration: number;
    message: string;
};

export type ProfileDetailsPayload = {
    hopperId: number;
    description: string;
    avatar?: string;
    banner?: string;
    isNsfw?: boolean;
    socials?: Array<{
        name: string;
        url: string;
    }>;
};

// New User Registration Payload
export type RegisterPayload = {
    email: string;
    username: string; // Unique
    password?: string;
    description?: string;
    avatar?: string;
    banner?: string;
    language: string;
    loginMethod: "email" | "google";
    buddies?: Array<{
        id: number;
        username: string;
        isFavorite: boolean;
    }>;
};

// Burrow for admin overview
export type AdminOverviewBurrow = {
    name: string;
    avatar: string;
    is_nsfw_allowed: boolean;
    dateCreation: string;
    tag: string[];
    is_banned: boolean;
    date_deleted: Date | null;
};

// Paginated Burrows
export type PaginatedAllBurrows = {
    data: AdminOverviewBurrow[];
    pagination: {
        page: number;
        total_pages: number;
    };
};

// Burrow tags
export type BurrowTags = {
    tags: string[];
};

// Burrow Post
export type Post = {
    id: number;
    burrow_id: number;
    hopper_id: number;
    title: string;
    description: string;
    type: PostTypes;
    is_nsfw: boolean;
    is_spoiler: boolean;
    is_concept: boolean;
    is_member: boolean;
    media?: string | null;
    burrow_label?: {
        id: number;
        name: string;
        color: string;
    } | null;
    praise: number | null;
    can_praise: boolean;
    can_comment: boolean;
    date_creation: Date;
    date_modified: Date;
    date_deleted: Date | null;
    deleted_by_id: number | null;
    deleted_by_type: string | null;
    upvote_count: number;
    comment_count: number;
    avatar: string | null;
    username: string;
    name: string;
    burrow_name: string;
    birthday: string;
    burrow_avatar: string | null;
};

export interface PostData {
    hopper_id: number;
    burrow_id: number;
    burrow_label_id?: number;
    title: string;
    description?: string;
    type: string;
    is_nsfw: boolean;
    is_spoiler: boolean;
    is_concept: boolean;
    media?: string;
    can_praise: boolean;
    can_comment: boolean;
    date_creation: Date;
}
export interface PostDataEdit {
    post_id: number;
    hopper_id: number;
    burrow_id: number;
    burrow_label_id?: number;
    title: string;
    description?: string;
    type: string;
    is_nsfw: boolean;
    is_spoiler: boolean;
    is_concept: boolean;
    media?: string;
    can_praise: boolean;
    can_comment: boolean;
    date_creation: Date;
}

export type Tag = {
    id: number;
    name: string;
    category: string;
};

export type Label = {
    id: number;
    name: string;
    color: string;
};
export type newLabel = {
    name: string;
    color: string;
};

// Burrow Post Types
export enum PostTypes {
    text = "text",
    video = "video",
    image = "image",
}

// Burrow Post Component Props
export type PostComponentProps = {
    loading?: boolean;
    id: number;
    hopper_id: number;
    burrowId: number;
    username: string;
    birthday: string;
    avatar: string | null;
    burrow: string;
    burrowAvatar?: string | null;
    timeAgo: string;
    title: string;
    description: string;
    praise: number;
    label?: {
        id: number;
        name: string;
        color: string;
    } | null;
    media?: string | null;
    imageAlt?: string;
    upvotes: number;
    comments: number;
    isNSFW?: boolean;
    isSpoiler?: boolean;
    member?: boolean;
    usernameHidden?: boolean;
    joinHidden?: boolean;
    burrowHidden?: boolean;
    descriptionHidden?: boolean;
    singleView?: boolean;
    type?: PostTypes;
    isPreview?: boolean;
};

// Comment Component Props
export type CommentComponentProps = {
    comment: Comment;
    allComments: Comment[];
    showBurrow?: boolean;
    postId?: number;
    hopperId: number;
    replies?: Comment[];
    isReply?: boolean;
    isPreview?: boolean;
};

// Burrow Types
export type BurrowKeeper = {
    email: string;
    username: string;
    avatar?: string | null;
};
export type BurrowSideBar = {
    name: string;
    avatar: string;
};
export type Burrow = {
    id: number;
    ownerId: number;
    name: string;
    description: string;
    avatar?: string | null;
    rules?: string[];
    banner?: string;
    is_nsfw_allowed: boolean;
    dateCreation: Date;
    dateModified: Date;
    memberCount: number;
    keepers: BurrowKeeper[];
    tags: string[];
    is_banned: boolean;
    date_deleted: Date | null;
};

export type TextareaType = "text" | "image" | "video";

// Cron Job Types
export enum CronJobTypes {
    userTimeout = "userTimeout",
    userBlock = "userBlock",
}
// MeiliSearch Response
export type SearchResponse = {
    results: Array<{
        id: number;
        username?: string;
        name?: string;
        title?: string;
        description?: string;
        avatar?: string;
        _federation: {
            indexUid: string;
            queriesPosition: number;
            weightedRankingScore: number;
        };
    }>;
    count: number;
    duration: number;
};

// Uplink Network Payload
export type UplinkMessage = {
    sender: string;
    recipient: string;
    triggerSource: string;
    reason: string;
    task: string;
    content: string;
    timestamp: Date;
};

// File Upload Path Types
export enum FileTypes {
    hopperAvatar = "hopper/avatar",
    hopperBanner = "hopper/banner",
    burrowAvatar = "burrow/avatar",
    burrowBanner = "burrow/banner",
    postImage = "post/image",
    postVideo = "post/video",
    system = "system",
}

// Report
export type Report = {
    category: string;
    description: string;
};

// Paginated reports
export type PaginatedReports = {
    data: Report[];
    pagination: {
        page: number;
        total_pages: number;
    };
};

// Hopper
export type AdminOverviewHopper = {
    id: number;
    username: string;
    email: string;
    avatar: string;
    is_banned: boolean;
};

// Paginated hoppers
export type PaginatedHoppers = {
    data: AdminOverviewHopper[];
    pagination: {
        page: number;
        total_pages: number;
    };
};
// Hopper
export type Hopper = {
    id: number;
    email: string;
    username: string;
    description: string;
    avatar: string;
    banner: string;
    socials: Array<{
        name: string;
        url: string;
    }>;
    achievements: Record<string, Date | null>;
    buddies: number;
    status: UserStatusTypes;
    is_nsfw_allowed: boolean;
    language: string;
    carrots: number;
    reputation: number;
    date_creation: Date;
    date_modified?: Date;
    date_verification?: Date | null;
    date_2fa?: Date | null;
    buddy_status?: BuddyStatus | null; // Active when visiting another Hopper's profile
    is_banned?: boolean;
};

export type Comment = {
    id: number;
    username: string;
    avatar: string | null;
    praise: number;
    upvotes: number;
    content: string;
    timeAgo: string;
    dateModified: string;
    postId: number;
    commentId: number;
    postTitle: string;
    postBurrow: string;
    postBurrowAvatar: string | null;
    isReply: boolean;
};

export type BuddyStatus = {
    has_connection: boolean;
    is_accepted: boolean;
    is_incoming: boolean;
};

export type NotificationItem = {
    hopper_id: number;
    type: NotificationTypes;
    data: any; // JSON payload
    url: string;
    source: string;
    is_read: boolean;
    ticket: string;
    is_silent: boolean;
    date_expiry: Date;
    date_creation: Date;
};

export enum NotificationTypes {
    initialize = "initialize",
    acknowledge = "ack",
    buddyNew = "buddy.request.new",
    buddyAccepted = "buddy.request.accepted",
    buddyDeclined = "buddy.request.declined",
    buddyRemoved = "buddy.request.removed",
    postComment = "post.comment",
    postPraise = "post.praise",
    commentReply = "comment.reply",
    commentPraise = "comment.praise",
    tailAccepted = "tail.accepted",
    tailNew = "buddy.tail.new",
    newAchievement = "achievement.new",
}

export type Buddy = {
    id: number;
    username: string;
    avatar: string | null;
    is_favorite?: boolean;
    isPending?: boolean;
    isIncoming?: boolean;
    isOutgoing?: boolean;
    isAccepted?: boolean;
};
