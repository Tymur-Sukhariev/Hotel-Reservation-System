"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '~/redux/store' 

const queryClient = new QueryClient();

export default function MyQueryClientProvider({children}:{children:React.ReactNode}){
  return(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}