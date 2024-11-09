import { Badge } from "@/components/ui/badge"


export const DesignBadges = () => {
    return (
        <>
            <Badge variant="default">Badge</Badge>
            <Badge variant="secondary">Badge</Badge>
            <Badge variant="outline">Badge</Badge>


            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">Fake</div>
        </>
    )
}