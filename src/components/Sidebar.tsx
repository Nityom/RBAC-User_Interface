import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    Users,
    ShieldCheck,
    LayoutDashboard,
    ChevronRight,
    Settings,
    Menu,
    X
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard"
        },
        {
            title: "Users",
            icon: Users,
            href: "/users"
        },
        {
            title: "Roles",
            icon: ShieldCheck,
            href: "/roles"
        },
        {
            title: "Settings",
            icon: Settings,
            href: "/settings"
        }
    ];

    const renderNavigation = (isMobile = false) => (
        <TooltipProvider delayDuration={0}>
            <nav className={cn("space-y-2", isMobile && "px-4")}>
                {navigationItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return isMobile ? (
                        <Link 
                            key={item.href} 
                            to={item.href} 
                            className="block"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 text-zinc-400 hover:text-white",
                                    "hover:bg-zinc-800/50 focus:bg-zinc-800/50",
                                    "transition-all duration-200",
                                    isActive && "bg-zinc-800 text-white"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5",
                                    isActive ? "text-white" : "text-zinc-400"
                                )} />
                                <span className="flex-1 text-left text-sm font-medium">
                                    {item.title}
                                </span>
                                {isActive && (
                                    <ChevronRight className="h-4 w-4 opacity-60" />
                                )}
                            </Button>
                        </Link>
                    ) : (
                        <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <Link to={item.href} className="block">
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start gap-3 text-zinc-400 hover:text-white",
                                            "hover:bg-zinc-800/50 focus:bg-zinc-800/50",
                                            "transition-all duration-200",
                                            isActive && "bg-zinc-800 text-white"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-5 w-5",
                                            isActive ? "text-white" : "text-zinc-400"
                                        )} />
                                        <span className="flex-1 text-left text-sm font-medium">
                                            {item.title}
                                        </span>
                                        {isActive && (
                                            <ChevronRight className="h-4 w-4 opacity-60" />
                                        )}
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className="bg-zinc-900 text-zinc-100 border-zinc-800"
                            >
                                {item.title}
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </nav>
        </TooltipProvider>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-screen w-64 flex-col bg-zinc-950 text-zinc-100">
                {/* Header */}
                <div className="flex h-16 items-center border-b border-zinc-800 px-6">
                    <h2 className="text-xl font-semibold text-white">RBAC Dashboard</h2>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 px-3 py-4">
                    {renderNavigation()}
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-zinc-800 p-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Users className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-100">Admin User</span>
                            <span className="text-xs text-zinc-400">admin@example.com</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-zinc-950 z-50">
                <div className="flex h-16 items-center justify-center relative px-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute left-4 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                    <h2 className="text-xl font-semibold text-white">
                        RBAC Dashboard
                    </h2>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-zinc-950 text-zinc-100 z-40 pt-16">
                    <ScrollArea className="h-full">
                        {renderNavigation(true)}

                        {/* Mobile Footer */}
                        <div className="border-t border-zinc-800 p-4 mt-4">
                            <div className="flex items-center gap-3 px-2">
                                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-zinc-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-zinc-100">Admin User</span>
                                    <span className="text-xs text-zinc-400">admin@example.com</span>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </>
    );
};

export default Sidebar;