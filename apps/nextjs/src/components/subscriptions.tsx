"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

//import { CreatePostSchema } from "@probable/db/schema";
import type { PitcherSubscription } from "@probable/ui";
import { cn, subscriptionSchedule } from "@probable/ui";

import { useTRPC } from "~/trpc/react";

//import { Button } from "@probable/ui/button";
//import {
//  Form,
//  FormControl,
//  FormField,
//  FormItem,
//  FormMessage,
//  useForm,
//} from "@probable/ui/form";
//import { Input } from "@probable/ui/input";
//import { toast } from "@probable/ui/toast";

//export function CreatePostForm() {
//  const form = useForm({
//    schema: CreatePostSchema,
//    defaultValues: {
//      content: "",
//      title: "",
//    },
//  });
//
//  const utils = api.useUtils();
//  const createPost = api.post.create.useMutation({
//    onSuccess: async () => {
//      form.reset();
//      await utils.post.invalidate();
//    },
//    onError: (err) => {
//      toast.error(
//        err.data?.code === "UNAUTHORIZED"
//          ? "You must be logged in to post"
//          : "Failed to create post",
//      );
//    },
//  });
//
//  return (
//    <Form {...form}>
//      <form
//        className="flex w-full max-w-2xl flex-col gap-4"
//        onSubmit={form.handleSubmit((data) => {
//          createPost.mutate(data);
//        })}
//      >
//        <FormField
//          control={form.control}
//          name="title"
//          render={({ field }) => (
//            <FormItem>
//              <FormControl>
//                <Input {...field} placeholder="Title" />
//              </FormControl>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="content"
//          render={({ field }) => (
//            <FormItem>
//              <FormControl>
//                <Input {...field} placeholder="Content" />
//              </FormControl>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <Button>Create</Button>
//      </form>
//    </Form>
//  );
//}

export function SubscriptionList() {
  // const [notifications] = api.notification.byDeviceId.useSuspenseQuery(
  //   "d11186c4-4d5c-4a4e-95c7-fd4c382c111d",
  // );
  const trpc = useTRPC();
  const { data: subscriptions } = useSuspenseQuery(
    trpc.subscription.byUserId.queryOptions(),
  );

  if (subscriptions.length === 0) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="inset-0 flex flex-col items-center justify-center">
          <p className="text-accent-foreground text-2xl font-bold">
            No subscriptions yet
          </p>
        </div>
      </div>
    );
  }

  const schedule = subscriptionSchedule(subscriptions);

  return (
    <div className="flex w-full flex-col gap-4">
      {schedule.map(({ nextGameDay, data }) => {
        return (
          <div key={nextGameDay} className="flex flex-col items-stretch gap-2">
            <h2 className="text-left">{nextGameDay}</h2>
            <div className="flex flex-col">
              {data.map((subscription, index) => (
                <PitcherSubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  className={`${index === 0 ? "rounded-t-lg" : ""} ${index === data.length - 1 ? "rounded-b-lg border-b-0" : ""}`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PitcherSubscriptionCard(props: {
  subscription: PitcherSubscription;
  className: string;
}) {
  //const utils = api.useUtils();
  //const deletePost = api.post.delete.useMutation({
  //  onSuccess: async () => {
  //    await utils.post.invalidate();
  //  },
  //  onError: (err) => {
  //    toast.error(
  //      err.data?.code === "UNAUTHORIZED"
  //        ? "You must be logged in to delete a post"
  //        : "Failed to delete post",
  //    );
  //  },
  //});
  console.log("className", props.className);

  return (
    <div
      className={cn(
        "bg-muted border-muted-foreground flex flex-row items-center gap-2 border-b p-1",
        props.className,
      )}
    >
      <p className="">{props.subscription.name}</p>
      <div className="text-muted-foreground flex flex-col items-center text-xs">
        <p className="">{props.subscription.number}</p>
        <p className="">{props.subscription.team.abbreviation}</p>
      </div>
      {/*<div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
          onClick={() => deletePost.mutate(props.post.id)}
        >
          Delete
        </Button>
      </div>*/}
    </div>
  );
}

export function SubscriptionSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "bg-primary w-1/4 rounded text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
