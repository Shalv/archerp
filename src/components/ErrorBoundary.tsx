import React from 'react';
export class ErrorBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(error:Error){console.error('Workspace error',error);}
  render(){return this.state.failed?<div className="p-10 max-w-xl mx-auto"><h1 className="text-2xl font-bold">This page could not be displayed</h1><p className="my-4">Reload to reconnect to your saved workspace. If this repeats, share the page name with support.</p><button className="px-4 py-2 bg-slate-900 text-white rounded" onClick={()=>window.location.reload()}>Reload workspace</button></div>:this.props.children;}
}
