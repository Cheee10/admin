import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import List from "../../components/tables/Passenger_T";

export default function Ptable() {
  return (
    <>

      <PageBreadcrumb pageTitle="List of Passengers" />
      <div className="space-y-6">
        <ComponentCard title="Passengers">
          <List />
        </ComponentCard>
      </div>
    </>
  );
}
