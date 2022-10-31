declare interface Train {
    time: string;
    carrier: string;
    destination: string;
    category: string;
    icon: string | null;
    number: string;
    platform: string;
    delay: string;
    isDelayed: boolean;
    isBlinking: boolean;
    isReplacedByBus: boolean;
    isIncomplete: boolean;
}
