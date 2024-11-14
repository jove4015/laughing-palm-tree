import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Laughing Palm Tree</title>
        <meta name="description" content="Reproduction Repo for Kiefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          padding: "2rem",
          lineHeight: 1.5,
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1>Laughing Palm Tree</h1>
        <p>Reproduction Repo for Kiefa</p>
        <br />
        <br />
        <p>
          This page demonstrates the use of the ClerkProvider, ClerkLoading, and
          ClerkLoaded components.
        </p>
        <br />
        <p>
          If Clerk has loaded properly, you should see an image of a laughing
          palm tree. If not, you should see a sad palm tree below.
        </p>
        <br />
        <br />
        <br />
        <ClerkLoading>
          <Image
            aria-hidden
            src="/sad_tree.png"
            alt="Not Loaded"
            width={200}
            height={200}
          />
        </ClerkLoading>
        <ClerkLoaded>
          <Image
            aria-hidden
            src="/happy_tree.png"
            alt="Loaded"
            width={200}
            height={200}
          />
        </ClerkLoaded>
      </div>
    </>
  );
}
