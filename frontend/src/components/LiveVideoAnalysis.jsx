


function LiveVideoAnalysis({ results , mostRecent}) {
  

  const calculateData = () => {
    let data = {};
    results.frames.forEach((f) => {
        if (Array.isArray(f)) {
            f.forEach((r) => {
                r.results.forEach((r) => {
                    if (data[r.class_id]) {
                        data[r.class_id] += 1;
                    } else {
                        data[r.class_id] = 1;
                    }
                });
            });
        } else {
            f.results.forEach((r) => {
                if (data[r.class_id]) {
                    data[r.class_id] += 1;
                } else {
                    data[r.class_id] = 1;
                }
            });
        }
    });
    let sortable = [];
    for (let object in data) {
        sortable.push([object, data[object]]);
    }
            sortable.sort(function(a,b) {
              return b[1] - a[1];
            })
            return sortable;
  
        }
        const calculateDataArray = () => {
          let data = [];
          mostRecent.frames.forEach((f) => {
              data.push(f.image);
            });
            return data;
        }
    let data = calculateData();
    let images = calculateDataArray();

  return (
    <div className="">
   
      <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Most Recent Chunk Analysis for {results.selector} in {mostRecent.run_time.toFixed(2)} seconds</p>
      <div className="grid grid-cols-3 gap-1 m-1">
        {mostRecent.frames.length !== 0 
          ? mostRecent.frames?.map((f, i) => (
              <img src={`data:image/jpeg;base64,${f.image}`} key={i}/>
            )) 
          : 
            <p>No Recent Results</p>
        }
      </div>
      <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Aggregate Video Analysis for {results.selector} </p>
      <div className="grid grid-cols-3 gap-1 m-1">
        { data.length !== 0 ? data?.map((f, i) => {
                return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f[0]}, Occurances: {f[1]}</div>
        }) : <p>No Total Results</p>}
      </div>
    </div>
  );
}

export default LiveVideoAnalysis;
