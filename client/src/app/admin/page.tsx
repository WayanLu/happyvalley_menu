import menuData from "../data.json";

interface MenuItem {
  id: number;
  name: string;
  price: number | string;
}

interface MenuData {
  menu: {
    [category: string]: MenuItem[];
  };
}

const AdminPage: React.FC = () => {
  const typedMenuData = menuData as MenuData;

  return (
    <div className="test">
      {Object.entries(typedMenuData.menu).map(([category, items]) => (
        <div key={category}>
          <p>{category}</p>
          <div>
            {items.map((item) => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
