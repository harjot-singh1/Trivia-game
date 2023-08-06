import React, {useEffect} from 'react'
// import Header from '../components/Header'

const LeaderboardScreen = () => {
  // useEffect(() => {
  //   // Initialize Looker
  //   const looker = window.lookerEmbed('https://lookerstudio.google.com/embed/reporting/f4677e7c-7595-4bb3-8774-81da4c02d558/page/Jk8XD');
    
  //   // Looker content ID (table ID)
  //   const tableContentId = 'your_table_content_id';
    
  //   // Get the embedded table
  //   looker
  //     .createExploreContent({ id: tableContentId })
  //     .appendTo('#looker-table')
  //     .withFilters({ your_filter_field_name: 'default_filter_value' }) // Set default filter values if needed
  //     .build()
  //     .connect()
  //     .catch((error) => {
  //       console.error('Error connecting to Looker', error);
  //     });
  // }, []);

  // return (
  //   <div id="looker-table">
  //     {/* The embedded Looker table will be placed here */}
  //   </div>
  // );
  return (
    <>
      {/* <Header /> */}
      <main className='p-4' style={{width: "100%",height: "100vh"}}>
        <h3>Leaderboard</h3>
        {/* <iframe width="80%" height="80%" src="https://lookerstudio.google.com/embed/reporting/f4677e7c-7595-4bb3-8774-81da4c02d558/page/Jk8XD" frameborder="0" allowfullscreen></iframe> */}
        <iframe width="95%" height="80%" src="https://lookerstudio.google.com/embed/reporting/30fbbe34-a5ca-4a0f-9536-d4ba7a67572c/page/i9UYD" frameborder="0" allowfullscreen></iframe>
      </main>
    </>
  )
}

export default LeaderboardScreen
