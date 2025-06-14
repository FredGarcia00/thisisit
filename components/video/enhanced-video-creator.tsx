'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wand2, 
  Bot, 
  Video, 
  Sparkles,
  RefreshCw,
  Crown,
  Play,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail_url: string;
  config: any;
  is_premium: boolean;
}

const avatarStyles = [
  { id: 'professional', name: 'Professional Male', description: 'Business attire, confident' },
  { id: 'casual', name: 'Casual Female', description: 'Friendly, approachable' },
  { id: 'fitness', name: 'Fitness Coach', description: 'Athletic wear, energetic' },
  { id: 'teacher', name: 'Educator', description: 'Smart casual, knowledgeable' }
];

const voiceOptions = [
  { id: 'male-professional', name: 'Professional Male', language: 'English' },
  { id: 'female-friendly', name: 'Friendly Female', language: 'English' },
  { id: 'male-spanish', name: 'Spanish Male', language: 'Spanish' },
  { id: 'female-spanish', name: 'Spanish Female', language: 'Spanish' }
];

export function EnhancedVideoCreator() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [formData, setFormData] = useState({
    template: '',
    title: '',
    prompt: '',
    avatar: '',
    voice: '',
    duration: '30'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const generateVideo = async () => {
    if (!user) {
      toast.error('Please sign in to create videos');
      return;
    }

    if (profile?.subscription_plan === 'free' && profile.videos_created_this_month >= 3) {
      toast.error('Free plan limit reached. Upgrade to Pro for unlimited videos.');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      toast.info('Creating video...');
      const createResponse = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title || 'Untitled Video',
          description: formData.prompt,
          prompt: formData.prompt,
          template_id: formData.template,
          voice_type: formData.voice,
          duration: parseInt(formData.duration)
        })
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(error.error || 'Failed to create video');
      }

      const { video } = await createResponse.json();
      setCurrentVideoId(video.id);
      setProgress(20);

      // Generate script
      toast.info('Generating AI script...');
      const scriptResponse = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: formData.prompt,
          duration: formData.duration,
          template: templates.find(t => t.id === formData.template)?.name
        })
      });
      const { script } = await scriptResponse.json();
      setProgress(40);

      // Create avatar
      toast.info('Creating AI avatar...');
      const avatarResponse = await fetch('/api/ai/create-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: formData.avatar,
          description: avatarStyles.find(a => a.id === formData.avatar)?.description
        })
      });
      const { avatar } = await avatarResponse.json();
      setProgress(60);

      // Generate voiceover
      toast.info('Generating voiceover...');
      const voiceResponse = await fetch('/api/ai/generate-voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: script,
          voice: formData.voice,
          language: voiceOptions.find(v => v.id === formData.voice)?.language
        })
      });
      const { voiceover } = await voiceResponse.json();
      setProgress(80);

      // Render video
      toast.info('Rendering video...');
      const renderResponse = await fetch('/api/ai/render-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          avatar_id: avatar.id,
          voice_audio_url: voiceover.audio_url,
          template_config: templates.find(t => t.id === formData.template)?.config
        })
      });
      const { video: renderedVideo } = await renderResponse.json();
      setProgress(100);

      // Update video record
      await supabase
        .from('videos')
        .update({
          status: 'completed',
          script_content: script,
          video_url: renderedVideo.video_url,
          thumbnail_url: renderedVideo.thumbnail_url
        })
        .eq('id', video.id);

      toast.success('Video generated successfully!');
    } catch (error: any) {
      console.error('Video generation error:', error);
      toast.error(error.message || 'Failed to generate video');
      
      if (currentVideoId) {
        await supabase
          .from('videos')
          .update({ status: 'failed' })
          .eq('id', currentVideoId);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedTemplate = templates.find(t => t.id === formData.template);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Create Your Video</h1>
        <p className="text-muted-foreground">
          Use AI to generate engaging short-form videos in minutes
        </p>
        {profile && (
          <div className="mt-4">
            <Badge variant={profile.subscription_plan === 'free' ? 'secondary' : 'default'}>
              {profile.subscription_plan === 'free' 
                ? `Free Plan: ${profile.videos_created_this_month}/3 videos used` 
                : `${profile.subscription_plan.toUpperCase()} Plan`
              }
            </Badge>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-16 h-0.5 ${step > stepNumber ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {step === 1 && <><Sparkles className="mr-2 h-5 w-5" /> Choose Template</>}
            {step === 2 && <><Wand2 className="mr-2 h-5 w-5" /> Content & Script</>}
            {step === 3 && <><Bot className="mr-2 h-5 w-5" /> Avatar & Voice</>}
            {step === 4 && <><Video className="mr-2 h-5 w-5" /> Generate Video</>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md relative
                    ${formData.template === template.id ? 'border-primary bg-primary/5' : 'border-border'}
                    ${template.is_premium && profile?.subscription_plan === 'free' ? 'opacity-50' : ''}
                  `}
                  onClick={() => {
                    if (template.is_premium && profile?.subscription_plan === 'free') {
                      toast.error('This template requires a Pro subscription');
                      return;
                    }
                    setFormData({...formData, template: template.id});
                  }}
                >
                  {template.is_premium && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                  <div className="flex space-x-4">
                    <img 
                      src={template.thumbnail_url} 
                      alt={template.name}
                      className="w-16 h-28 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Content & Script */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  placeholder="Give your video a catchy title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="prompt">Video Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what you want your video to be about..."
                  value={formData.prompt}
                  onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="duration">Video Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Avatar & Voice */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label>AI Avatar Style</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {avatarStyles.map((avatar) => (
                    <div
                      key={avatar.id}
                      className={`
                        border rounded-lg p-3 cursor-pointer transition-all
                        ${formData.avatar === avatar.id ? 'border-primary bg-primary/5' : 'border-border'}
                      `}
                      onClick={() => setFormData({...formData, avatar: avatar.id})}
                    >
                      <h4 className="font-medium">{avatar.name}</h4>
                      <p className="text-sm text-muted-foreground">{avatar.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Voice Selection</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {voiceOptions.map((voice) => (
                    <div
                      key={voice.id}
                      className={`
                        border rounded-lg p-3 cursor-pointer transition-all
                        ${formData.voice === voice.id ? 'border-primary bg-primary/5' : 'border-border'}
                      `}
                      onClick={() => setFormData({...formData, voice: voice.id})}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{voice.name}</h4>
                        <Badge variant="secondary">{voice.language}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Generate */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-medium mb-3">Video Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Template:</strong> {selectedTemplate?.name}</p>
                  <p><strong>Title:</strong> {formData.title || 'Untitled Video'}</p>
                  <p><strong>Duration:</strong> {formData.duration} seconds</p>
                  <p><strong>Avatar:</strong> {avatarStyles.find(a => a.id === formData.avatar)?.name}</p>
                  <p><strong>Voice:</strong> {voiceOptions.find(v => v.id === formData.voice)?.name}</p>
                </div>
              </div>

              {isGenerating && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Generating your video...</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {!isGenerating && progress === 100 && (
                <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 text-green-800 dark:text-green-400 mb-2">
                    <Video className="h-4 w-4" />
                    <span className="font-medium">Video Ready!</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setStep(step - 1)} 
          disabled={step === 1}
        >
          Previous
        </Button>
        <div className="space-x-2">
          {step < 4 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.template) ||
                (step === 2 && (!formData.prompt || !formData.title)) ||
                (step === 3 && (!formData.avatar || !formData.voice))
              }
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={generateVideo}
              disabled={isGenerating || progress === 100 || !user}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : progress === 100 ? (
                'Generated'
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Video
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}