import PGSearchPage from "@/app/pg-colive/_components/PGSearchPage";

export default function PGColiveListing({ searchParams }) {
        const reference = searchParams?.reference || null;
        return <PGSearchPage reference={reference} />;

}

