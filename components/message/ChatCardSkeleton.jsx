import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatCardSkeleton() {
  return (
    <Card className="mb-2 w-full max-w-full overflow-hidden">
      <CardContent className="p-3">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3 w-full min-w-0">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="min-w-0 flex flex-col justify-center">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2 mb-2">
              <Skeleton className="h-4 w-2/3 max-w-[150px]" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-2 min-w-0">
              <Skeleton className="h-3 w-4/5 max-w-[200px]" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
