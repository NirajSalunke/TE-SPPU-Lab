import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Mapper;
import java.io.IOException;

public class WeatherMapper extends Mapper<LongWritable, Text, Text, Text> {
    public void map(LongWritable key, Text value, Context context)
            throws IOException, InterruptedException {
        String[] fields = value.toString().trim().split("\\s+");
        if (fields.length == 4) {
            // Emit: key="weather", value="temp,dew,wind"
            context.write(new Text("weather"), new Text(fields[1] + "," + fields[2] + "," + fields[3]));
        }
    }
}
