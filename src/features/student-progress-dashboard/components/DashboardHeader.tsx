import { CLASS_NAME } from "@config";

export function DashboardHeader() {
    const className = CLASS_NAME?.trim();

    return (
        <h1 className="font-bold text-3xl">
            {className ? `${className} ` : ""}Progress Dashboard
        </h1>
    )
}
