"use client"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Stethoscope, User, Shield, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const roles = [
    {
        id: "user",
        title: "User",
        subtitle: "Personal Healthcare",
        description: "Access healthcare services, book appointments, and manage your health records",
        icon: User,
        color: "from-sky-500 to-blue-600",
        bgColor: "bg-sky-50",
        borderColor: "border-sky-200",
        hoverBorder: "hover:border-sky-400",
        link: "/auth/register", // Added direct link for user role
        popular: true,
        features: [
            { icon: Clock, text: "Quick registration" },
            { icon: Shield, text: "Secure health records" },
            { icon: Star, text: "Free to use" },
        ],
    },
    {
        id: "provider",
        title: "Healthcare Provider",
        subtitle: "Professional Account",
        description: "Manage patients, appointments, and provide professional healthcare services",
        icon: Stethoscope,
        color: "from-purple-500 to-violet-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        hoverBorder: "hover:border-purple-400",
        link: "/auth/register/provider", // Added direct link for provider role
        popular: false,
        features: [
            { icon: Shield, text: "Professional verification" },
            { icon: Star, text: "Advanced tools" },
            { icon: Clock, text: "Priority support" },
        ],
    },
]

export default function RoleSelection() {
    return (
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl shadow-black/10 px-6 py-8">
            <div className="space-y-6">
                {/* Back Button */}
                <Button variant="ghost" asChild className="w-fit text-slate-600 hover:text-slate-800 hover:bg-slate-100 -ml-2">
                    <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </Button>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Choose Your Role
                    </h1>
                    <p className="text-slate-600 text-sm">Select how you want to use our platform</p>
                </div>

                {/* Role Cards */}
                <div className="space-y-4">
                    {roles.map((role) => (
                        <Link key={role.id} href={role.link} className="block">
                            <Card
                                className={`cursor-pointer transition-all duration-300 border-2 ${role.borderColor} ${role.hoverBorder} hover:shadow-lg hover:scale-[1.02] group`}
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`h-12 w-12 bg-gradient-to-br ${role.color} flex flex-shrink-0 items-center justify-center rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow`}
                                        >
                                            <role.icon className="h-6 w-6 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-slate-800">{role.title}</h3>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 mb-2">{role.subtitle}</p>
                                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{role.description}</p>

                                            {/* Features */}
                                            <div className="space-y-2">
                                                {role.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <feature.icon className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="text-xs text-slate-600">{feature.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Arrow Indicator */}
                                        <div className="flex h-6 w-6 items-center justify-center">
                                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </Card>
    )
}
