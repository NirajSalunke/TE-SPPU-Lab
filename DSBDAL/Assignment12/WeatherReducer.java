import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Reducer;
import java.io.IOException;

public class WeatherReducer extends Reducer<Text, Text, Text, Text> {
    public void reduce(Text key, Iterable<Text> values, Context context)
            throws IOException, InterruptedException {
        double sumTemp = 0, sumDew = 0, sumWind = 0;
        int count = 0;
        for (Text val : values) {
            String[] fields = val.toString().split(",");
            sumTemp += Double.parseDouble(fields[0]);
            sumDew  += Double.parseDouble(fields[1]);
            sumWind += Double.parseDouble(fields[2]);
            count++;
        }
        String result = String.format("AvgTemp=%.2f, AvgDew=%.2f, AvgWind=%.2f",
                sumTemp/count, sumDew/count, sumWind/count);
        context.write(key, new Text(result));
    }
}
