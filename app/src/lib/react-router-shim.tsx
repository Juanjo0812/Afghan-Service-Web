'use client'

import NextLink from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useMemo, type ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/*  No-op wrappers for removed react-router constructs                */
/* ------------------------------------------------------------------ */

export function BrowserRouter({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function Routes({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Route(_props: {
  path?: string
  element?: ReactNode
  children?: ReactNode
  [key: string]: unknown
}) {
  return null
}

export function Outlet() {
  return null
}

/* ------------------------------------------------------------------ */
/*  Link -> next/link                                                 */
/* ------------------------------------------------------------------ */

export function Link({
  to,
  replace,
  children,
  ...props
}: {
  to: string
  replace?: boolean
  children?: ReactNode
  [key: string]: unknown
}) {
  return (
    <NextLink href={to} replace={replace} {...props}>
      {children}
    </NextLink>
  )
}

/* ------------------------------------------------------------------ */
/*  useLocation -> next/navigation                                    */
/* ------------------------------------------------------------------ */

export function useLocation() {
  const pathname = usePathname() || '/'
  const searchParams = useSearchParams()

  return useMemo(
    () => ({
      pathname,
      search: searchParams?.toString() ? `?${searchParams.toString()}` : '',
      hash: '',
      state: null,
      key: 'default',
    }),
    [pathname, searchParams]
  )
}

/* ------------------------------------------------------------------ */
/*  useNavigate -> next/navigation                                    */
/* ------------------------------------------------------------------ */

export function useNavigate() {
  const router = useRouter()

  return useCallback(
    (to: string | number, options?: { replace?: boolean }) => {
      if (typeof to === 'number') {
        if (to === -1) router.back()
        else if (to === 1) router.forward()
        return
      }
      if (options?.replace) {
        router.replace(to)
      } else {
        router.push(to)
      }
    },
    [router]
  )
}

/* ------------------------------------------------------------------ */
/*  useParams -> no-op (not used in current codebase)                 */
/* ------------------------------------------------------------------ */

export function useParams() {
  return {}
}
