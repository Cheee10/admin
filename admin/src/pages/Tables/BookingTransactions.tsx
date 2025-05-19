import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BTL from "../../components/tables/BookingTransaction_T";

export default function BTtable() {
  return (
    <>

      <PageBreadcrumb pageTitle="List of Booking Transactions" />
      <div className="space-y-6">
        <ComponentCard title="Booking Transactions">
          <BTL />
        </ComponentCard>
      </div>
    </>
  );
}
