import org.apache.spark.sql.SparkSession

object SortArraySpark {
  def main(args: Array[String]): Unit = {

    // Initialize Spark Session
    val spark = SparkSession.builder()
      .appName("Sort Array using Spark")
      .master("local[*]")
      .getOrCreate()

    val sc = spark.sparkContext
    sc.setLogLevel("ERROR")

    // Take user input
    println("Enter the number of elements:")
    val n = scala.io.StdIn.readInt()

    println(s"Enter $n space-separated integers:")
    val inputLine = scala.io.StdIn.readLine()
    val inputArray = inputLine.trim.split("\\s+").map(_.toInt)

    // Create RDD from user input array
    val rdd = sc.parallelize(inputArray)

    // Sort the RDD
    val sortedRDD = rdd.sortBy(x => x)

    // Collect and print results
    val sortedArray = sortedRDD.collect()
    println("Sorted Array: " + sortedArray.mkString(", "))

    spark.stop()
  }
}
