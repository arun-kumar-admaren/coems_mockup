import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Ship, Anchor, TrendingUp, Users } from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "Active Vessels",
      value: "24",
      change: "+2 from last month",
      icon: Ship,
    },
    {
      title: "Active Charters",
      value: "18",
      change: "+5 from last month",
      icon: Anchor,
    },
    {
      title: "Revenue (YTD)",
      value: "$12.4M",
      change: "+18% from last year",
      icon: TrendingUp,
    },
    {
      title: "Clients",
      value: "47",
      change: "+3 from last month",
      icon: Users,
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to COEMS - Your chartering operations overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
