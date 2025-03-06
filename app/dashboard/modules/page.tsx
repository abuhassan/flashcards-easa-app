// app/dashboard/modules/page.tsx
import { initialModules } from '@/lib/data/module-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ModulesPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">EASA Modules</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialModules.map(module => (
          <Card key={module.id}>
            <CardHeader>
              <Badge className="mb-2 w-fit">{module.category}</Badge>
              <CardTitle>Module {module.number}: {module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <p className="text-sm text-gray-500 mb-4">{module.topics.length} topics</p>
              <Link href={`/dashboard/modules/${module.id}`}>
                <Button>Browse Topics</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}