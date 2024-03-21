// import { useRouter } from 'next/router';
// import { ComponentType, ReactElement } from 'react';

// //TODO: Implement - Currently just a placeholder

// type AuthProps = {
//   // Define any additional props that the authenticated component may need here.
// };

// type WithAuthProps = {
//   // Define the common props shared by all components wrapped by withAuth.
// };

// // Define the withAuth HOC
// const withAuth =
//   <P extends WithAuthProps>(
//     WrappedComponent: ComponentType<P>
//   ): ComponentType<P> =>
//   (props: P): ReactElement => {
//     const router = useRouter();
//     // const { status } = useSession({
//     //   required: true,
//     //   onUnauthenticated() {
//     //     router.push('/welcome/login');
//     //   },
//     // });

//     // if (status === 'loading') {
//     //   return <div>Loading ...</div>;
//     // }

//     // Pass any additional props required by the wrapped component
//     // to ensure type safety.
//     const authProps: AuthProps = {
//       // Define your authentication-related props here if needed.
//     };

//     return <WrappedComponent {...props} {...authProps} />;
//   };

// export default withAuth;
