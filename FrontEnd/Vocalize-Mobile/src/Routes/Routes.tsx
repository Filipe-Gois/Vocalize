import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "../Screens/Main/Main";

const client = new QueryClient();

const Routes = () => {
  return (
    <QueryClientProvider client={client}>
      <Main />
    </QueryClientProvider>
  );
};

export default Routes;
