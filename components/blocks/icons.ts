/**
 * Icon Utility
 * Maps icon names to Lucide components
 */

import {
    Zap, Shield, Rocket, Target, Users, TrendingUp,
    Star, Heart, Settings, Globe, Code, Layers,
    Check, ArrowRight, Mail, type LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    zap: Zap,
    shield: Shield,
    rocket: Rocket,
    target: Target,
    users: Users,
    trending: TrendingUp,
    star: Star,
    heart: Heart,
    settings: Settings,
    globe: Globe,
    code: Code,
    layers: Layers,
    check: Check,
    arrow: ArrowRight,
    mail: Mail,
};

export function getIcon(iconName: string): LucideIcon {
    return iconMap[iconName?.toLowerCase()] || Zap;
}

export { iconMap };
