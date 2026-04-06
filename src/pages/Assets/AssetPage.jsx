import { useSelector } from "react-redux";
import EnhancedTable from "../../components/table/EnhancedTable";
import "../../styles/Assets/AssetsPage.css";
import EmptyAssetPage from "./EmptyAssetPage";

const AssetPage = () => {
  const { tableData, tableColumns } = useSelector((state) => state.upload);

  console.log("AssetPage - tableData:", tableData);

  return (
    <div>
      <div className="ph">
        <div className="ph-title">Assets</div>
        <div className="ph-sub">
          All {tableData.length} tracked assets with due date monitoring
        </div>
      </div>
      {tableData.length > 0 ? (
        <div style={{ marginTop: 16 }}>
          <EnhancedTable
            rows={tableData}
            headCells={tableColumns}
            title={` Assets Registered - ${tableData.length} `}
          />
        </div>
      ) : (
        <div style={{ marginTop: 32 }}>
          <EmptyAssetPage />
        </div>
      )}
    </div>
  );
};

export default AssetPage;
