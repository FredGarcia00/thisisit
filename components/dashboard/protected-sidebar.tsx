'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  LayoutDashboard, 
  Bot, 
  BarChart3, 
  Settings, 
  Crown,
  Palette,
  X,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Video', href: '/dashboard/create', icon: Video },
  { name: 'AI Avatars', href: '/dashboard/avatars', icon: Bot },
  { name: 'Templates', href: '/dashboard/templates', icon: Palette },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface ProtectedSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ProtectedSidebar({ open, setOpen }: ProtectedSidebarProps) {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r">
          <SidebarContent onClose={() => setOpen(false)} profile={profile} onSignOut={handleSignOut} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:bg-card lg:border-r">
        <SidebarContent profile={profile} onSignOut={handleSignOut} />
      </div>
    </>
  );
}

function SidebarContent({ 
  onClose, 
  profile, 
  onSignOut 
}: { 
  onClose?: () => void;
  profile: any;
  onSignOut: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <Video className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold gradient-text">ViralReel Studio</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <Crown className="h-5 w-5 text-primary" />
            <Badge variant="secondary">
              {profile?.subscription_plan?.toUpperCase() || 'FREE'} Plan
            </Badge>
          </div>
          {profile?.subscription_plan === 'free' && (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                {profile?.videos_created_this_month || 0} of 3 videos used this month
              </p>
              <Button asChild size="sm" className="w-full mb-2">
                <Link href="/pricing">Upgrade to Pro</Link>
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-muted-foreground"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}