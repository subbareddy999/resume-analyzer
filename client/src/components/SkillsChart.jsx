import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from "lucide-react";

// Converted and adapted from the lovable.dev design
export function SkillsChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-medium">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Technical Skills Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                  cursor={{ fill: 'hsl(var(--accent))' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                <Bar
                  dataKey="proficiency"
                  fill="hsl(var(--primary))"
                  name="Your Proficiency"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="marketDemand"
                  fill="hsl(var(--success))"
                  name="Market Demand"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            A comparison of your skill proficiency vs. current market demand.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
