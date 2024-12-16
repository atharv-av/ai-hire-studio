import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const CreateCustomTest = () => {
  return (
    <Card className="mt-4 max-w-md mx-auto bg-black/70 border-white/20">
      <CardHeader>
        <CardTitle className="text-white/90">Custom Modules Coming Soon!</CardTitle>
        <CardDescription className="text-white/70">
          Create your own custom test modules with personalized questions. Stay tuned!
        </CardDescription>
      </CardHeader>
    </Card>
  );
};