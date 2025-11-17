import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Cria um novo QueryClient para cada teste
 * Isso garante que os testes não compartilhem cache
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Desabilita retry em testes
        gcTime: Infinity, // Mantém cache durante o teste
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface AllTheProvidersProps {
  children: React.ReactNode
}

/**
 * Wrapper com todos os providers necessários para os testes
 */
function AllTheProviders({ children }: AllTheProvidersProps) {
  const queryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

/**
 * Custom render que inclui os providers necessários
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Re-export tudo do @testing-library/react
export * from '@testing-library/react'

// Override o render padrão com nosso customRender
export { customRender as render }
