import { CLASS_NAME } from "@config";

export function DashboardHeader() {
    return (
        <h1 className="font-bold text-3xl">
            {`${CLASS_NAME != null ? CLASS_NAME + " " : ""}`}Progress Dashboard
        </h1>
    )
}
