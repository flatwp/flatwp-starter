/**
 * Homepage
 * Displays WordPress content from the homepage using FlatWP blocks
 */

import { siteConfig } from '@/lib/config';

export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="py-20 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    Welcome to {siteConfig.name}
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {siteConfig.description}
                </p>
                <div className="mt-10 flex items-center justify-center gap-4">
                    <a
                        href="/blog"
                        className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        Read the Blog
                    </a>
                    <a
                        href="/about"
                        className="rounded-md px-6 py-3 text-sm font-semibold text-foreground ring-1 ring-border hover:bg-muted"
                    >
                        Learn More
                    </a>
                </div>
            </section>

            {/* Features placeholder */}
            <section className="py-20 border-t">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Features</h2>
                    <p className="mt-4 text-muted-foreground">
                        This section will display FlatWP Gutenberg blocks from WordPress
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {['Fast', 'Flexible', 'Modern'].map((feature) => (
                        <div key={feature} className="rounded-lg border p-6 text-center">
                            <h3 className="text-xl font-semibold">{feature}</h3>
                            <p className="mt-2 text-muted-foreground">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
