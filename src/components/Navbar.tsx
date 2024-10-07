import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import NavItems from "./NavItems";
import { buttonVariants } from "./ui/button";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import UserAccountNav from "./UserAccountNav";
import MobileNav from "./MobileNav";

// Ensure the cookies and user data are fetched synchronously
const Navbar = async () => {
  // Fetch cookies in the appropriate context
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <MobileNav />

              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Icons.logo />
                </Link>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {!user ? (
                    <>
                      <Link
                        href="/sign-in"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Sign in
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link
                        href="/sign-up"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Create account
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/verify-certificate"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Verify Certificate
                      </Link>
                      {user.role === "superadmin" && (
                        <>
                          <Link
                            href="/analytics"
                            className={buttonVariants({ variant: "ghost" })}
                          >
                            Dashboard
                          </Link>
                          <span
                            className="h-6 w-px bg-gray-200"
                            aria-hidden="true"
                          />
                        </>
                      )}
                      <Link
                        href="/view-orders"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        My Orders
                      </Link>
                      <UserAccountNav user={user} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
