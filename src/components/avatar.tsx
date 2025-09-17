import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { UserProps } from "@/types/types";
import { useLogout } from "@/hooks/useAuthMutation";

export default function AvatarDropdownmenu({ user }: { user?: UserProps }) {
    const { mutate: logout } = useLogout();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full">
                <Avatar>
                    <AvatarFallback>{user?.image ? <img src={user.image} alt={user.name} /> : <span>A</span>}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="py-3">
                    <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.image ? <img src={user.image} alt={user.name} /> : user?.name.charAt(0).toUpperCase() || 'A'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-1 flex flex-col">
                        <p className="text-sm font-medium">{user?.name ? user.name : 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">
                            {user?.email ? user.email : 'No Email'}
                        </p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => logout()}>
                    <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}