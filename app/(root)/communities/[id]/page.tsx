import Image from "next/image";
import { currentUser } from '@clerk/nextjs/server';

import { communityTabs } from "@/constants/index";

import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchCommunityDetails } from "@/lib/actions/community.actions";

async function Page({ params }: { params: Promise<{ id: string }> }) {  // ✅ Await params if it's a Promise
    const resolvedParams = await params; // ✅ Ensure params is awaited

    console.log("🔍 Received Params:", resolvedParams); 

    if (!resolvedParams?.id) {
        console.error("❌ Missing ID in params.");
        return null;
    }

    const user = await currentUser();
    if (!user) {
        console.error("❌ User not authenticated.");
        return null;
    }

    console.log("✅ Authenticated User:", user.id);

    const communityDetails = await fetchCommunityDetails(resolvedParams.id); // ✅ Use resolvedParams.id
    
    if (!communityDetails) {
        console.error(`❌ Community details not found for ID: ${resolvedParams.id}`);
        return null;
    }

    console.log("✅ Community Details Fetched:", communityDetails);

    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.createdBy?.id || ""}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type='Community'
            />

            <div className='mt-9'>
                <Tabs defaultValue='threads' className='w-full'>
                    <TabsList className='tab'>
                        {communityTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className='object-contain'
                                />
                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === "Threads" && communityDetails.threads && (
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {communityDetails.threads.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value='threads' className='w-full text-light-1'>
                        {communityDetails.threads?.length > 0 ? (
                            <ThreadsTab
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType='Community'
                            />
                        ) : (
                            <p className="text-light-2">No threads available.</p>
                        )}
                    </TabsContent>

                    <TabsContent value='members' className='mt-9 w-full text-light-1'>
                        <section className='mt-9 flex flex-col gap-10'>
                            {communityDetails.members?.length > 0 ? (
                                communityDetails.members.map((member: any) => (
                                    <UserCard
                                        key={member.id}
                                        id={member.id}
                                        name={member.name}
                                        username={member.username}
                                        imgUrl={member.image}
                                        personType='User'
                                    />
                                ))
                            ) : (
                                <p className="text-light-2">No members found.</p>
                            )}
                        </section>
                    </TabsContent>

                    <TabsContent value='requests' className='w-full text-light-1'>
                        {communityDetails.requests?.length > 0 ? (
                            <ThreadsTab
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType='Community'
                            />
                        ) : (
                            <p className="text-light-2">No pending requests.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}

export default Page;
