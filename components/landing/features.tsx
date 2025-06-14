'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Mic, 
  Video, 
  Palette, 
  BarChart3, 
  Share2
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI Avatar Generation',
    description: 'Create hyper-realistic avatars with HeyGen API from simple text prompts',
    badge: 'AI Powered'
  },
  {
    icon: Mic,
    title: 'Natural Voiceovers',
    description: 'Generate professional voiceovers in multiple languages with ElevenLabs',
    badge: 'Multi-Language'
  },
  {
    icon: Video,
    title: 'Smart Video Rendering',
    description: 'Render high-quality videos with RunwayML and auto-generated captions',
    badge: 'HD Quality'
  },
  {
    icon: Palette,
    title: 'Custom Templates',
    description: 'Choose from trending templates or create your own for any niche',
    badge: 'Customizable'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance with detailed analytics and engagement metrics',
    badge: 'Insights'
  },
  {
    icon: Share2,
    title: 'One-Click Sharing',
    description: 'Export and share directly to TikTok, Instagram, and YouTube',
    badge: 'Social Ready'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to create{' '}
            <span className="gradient-text">viral content</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive suite of AI-powered tools makes video creation effortless and engaging
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="h-full hover:shadow-lg transition-all duration-300 glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}