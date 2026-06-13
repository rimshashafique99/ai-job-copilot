import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Rocket,
  Zap,
  Layers,
  Code2,
  Moon,
  Sun,
  Github,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Rocket,
    title: 'Lightning Fast',
    description: 'Vite provides instant server start and lightning-fast HMR.',
  },
  {
    icon: Layers,
    title: 'ShadCN UI',
    description: 'Beautiful, accessible components built with Radix UI and Tailwind.',
  },
  {
    icon: Code2,
    title: 'TypeScript',
    description: 'Full TypeScript support for better DX and fewer bugs.',
  },
  {
    icon: Zap,
    title: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development.',
  },
];

const components = [
  { name: 'Button', description: 'Interactive button variants' },
  { name: 'Card', description: 'Container for content' },
  { name: 'Badge', description: 'Labels and status indicators' },
  { name: 'Dialog', description: 'Modal dialogs' },
  { name: 'Dropdown', description: 'Menu dropdowns' },
  { name: 'Form', description: 'Form handling with validation' },
  { name: 'Table', description: 'Data tables' },
  { name: 'Toast', description: 'Notification toasts' },
];

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">React Starter</span>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4">
              React 18 + Vite 5
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Modern React Boilerplate
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              A production-ready starter template with React, Vite, Tailwind CSS, and ShadCN UI
              components. Start building beautiful applications faster.
            </p>
            <div className="flex gap-4">
              <Button size="lg">
                Get Started
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Documentation
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section className="container px-4 py-16 md:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">Tech Stack</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-all hover:shadow-md">
                <CardHeader>
                  <feature.icon className="mb-2 h-10 w-10 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Demo Section */}
        <section className="container px-4 py-16 md:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">Component Preview</h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Form Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>Beautiful form inputs and controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" />
                </div>
                <Button className="w-full">Sign In</Button>
              </CardContent>
            </Card>

            {/* Components List */}
            <Card>
              <CardHeader>
                <CardTitle>Available Components</CardTitle>
                <CardDescription>50+ components included</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {components.map((comp) => (
                    <Badge key={comp.name} variant="secondary" className="px-3 py-1">
                      {comp.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8">
          <div className="container px-4 text-center text-sm text-muted-foreground md:px-8">
            <p>
              Built with React, Vite, Tailwind CSS, and ShadCN UI. Ready for your next project.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
