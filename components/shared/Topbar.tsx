import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton redirectUrl="https://resolved-drum-2.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F">
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
  appearance={{
    elements: {
      rootBox: "rounded-lg shadow-lg border border-gray-800 bg-dark-1 text-white",
      organizationSwitcherTrigger:
        "py-2 px-4 flex items-center gap-2 rounded-lg bg-dark-2 hover:bg-dark-3 transition-all duration-200 border border-gray-700 text-white",
      organizationSwitcherPopoverRootBox:
        "bg-dark-1 border border-gray-800 shadow-2xl rounded-xl",
      organizationSwitcherPopoverCard:
        "bg-dark-2 border border-gray-700 shadow-lg rounded-xl p-4",
      organizationSwitcherPopoverMain:
        "bg-dark-2 border border-gray-700 shadow-lg rounded-xl p-3",
      organizationSwitcherPopoverActions:
        "flex flex-col gap-2 text-gray-100 font-medium",
      organizationSwitcherPreviewButton:
        "bg-dark-2 text-gray-100 hover:bg-dark-3 hover:text-white rounded-md px-4 py-2 flex items-center gap-2 transition-all",
      organizationSwitcherPopoverFooter: "hidden",
      
    },
  }}
/>


      </div>
    </nav>
  );
}

export default Topbar;
