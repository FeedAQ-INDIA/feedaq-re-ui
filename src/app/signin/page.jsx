// app/signin/page.jsx
import SignInPage from "./_components/SignInPage"; // client component

export default function Page({ searchParams }) {
    const redirectUri = searchParams?.redirectUri || null;
    return <SignInPage redirectUri={redirectUri} />;
}
