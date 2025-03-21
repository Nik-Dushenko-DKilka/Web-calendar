"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState<{ username: string; userImg: string }>();

  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      setUser({
        username: session.data.user?.name!,
        userImg: session.data.user?.image!,
      });
    }
  }, [session]);

  return (
    user?.userImg && (
      <>
        <main className="flex p-4 h-[90%]">
          <aside>
            <img
              src={user.userImg}
              alt="User icon"
              className="justify-self-center w-52"
            />
          </aside>
          <h2 className="ml-4 font-bold text-4xl">{user.username}</h2>
        </main>
        <footer className="h-[10%]">
          <button
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
          >
            Log out
          </button>
        </footer>
      </>
    )
  );
};

export default Profile;
